import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBloodPressure } from 'app/shared/model/blood-pressure.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { BloodPressureService } from './blood-pressure.service';
import { BloodPressureDeleteDialogComponent } from './blood-pressure-delete-dialog.component';

@Component({
  selector: 'jhi-blood-pressure',
  templateUrl: './blood-pressure.component.html'
})
export class BloodPressureComponent implements OnInit, OnDestroy {
  bloodPressures: IBloodPressure[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;
  currentSearch: string;

  constructor(
    protected bloodPressureService: BloodPressureService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute
  ) {
    this.bloodPressures = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0
    };
    this.predicate = 'id';
    this.ascending = true;
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll(): void {
    if (this.currentSearch) {
      this.bloodPressureService
        .search({
          query: this.currentSearch,
          page: this.page,
          size: this.itemsPerPage,
          sort: this.sort()
        })
        .subscribe((res: HttpResponse<IBloodPressure[]>) => this.paginateBloodPressures(res.body, res.headers));
      return;
    }

    this.bloodPressureService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IBloodPressure[]>) => this.paginateBloodPressures(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.bloodPressures = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  search(query: string): void {
    this.bloodPressures = [];
    this.links = {
      last: 0
    };
    this.page = 0;
    if (query) {
      this.predicate = '_score';
      this.ascending = false;
    } else {
      this.predicate = 'id';
      this.ascending = true;
    }
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInBloodPressures();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IBloodPressure): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInBloodPressures(): void {
    this.eventSubscriber = this.eventManager.subscribe('bloodPressureListModification', () => this.reset());
  }

  delete(bloodPressure: IBloodPressure): void {
    const modalRef = this.modalService.open(BloodPressureDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bloodPressure = bloodPressure;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateBloodPressures(data: IBloodPressure[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.bloodPressures.push(data[i]);
      }
    }
  }
}
